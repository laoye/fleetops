<?php

namespace Fleetbase\FleetOps\Http\Controllers\Internal\v1;

use Fleetbase\FleetOps\Http\Controllers\FleetOpsController;
use Fleetbase\FleetOps\Models\Entity;
use Fleetbase\FleetOps\Models\Order;
use Fleetbase\FleetOps\Models\Proof;
use Fleetbase\FleetOps\Models\Waypoint;
use Fleetbase\FleetOps\Support\Utils;
use Fleetbase\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProofController extends FleetOpsController
{
    /**
     * The resource to query.
     *
     * @var string
     */
    public $resource = 'proof';

    /**
     * Verify a QR code.
     *
     * @return void
     */
    public function verifyQrCode(string $publicId, Request $request)
    {
        $code = $request->input('code');
        $type = $request->input('type', strtok($publicId, '_'));

        switch ($type) {
            case 'order':
                $subject = Order::where('uuid', $code)->withoutGlobalScopes()->first();
                break;

            case 'waypoint':
                $subject = Waypoint::where('uuid', $code)->withoutGlobalScopes()->first();
                break;

            case 'entity':
                $subject = Entity::where('uuid', $code)->withoutGlobalScopes()->first();
                break;
        }

        if (!$subject) {
            return response()->error('Unable to validate QR code data.');
        }

        // validate
        if ($publicId === $subject->public_id) {
            // create verification proof
            $proof = Proof::create([
                'company_uuid' => session('company'),
                'subject_uuid' => $subject->uuid,
                'subject_type' => Utils::getModelClassName($subject),
                'remarks'      => 'Verified by QR Code Scan',
                'raw_data'     => $request->input('raw_data'),
                'data'         => $request->input('data'),
            ]);

            return response()->json([
                'status' => 'success',
                'proof'  => $proof->public_id,
            ]);
        }

        return response()->error('Unable to validate QR code data.');
    }

    /**
     * Validate a QR code.
     *
     * @return void
     */
    public function captureSignature(string $publicId, Request $request)
    {
        $signature = $request->input('signature');
        $type      = $request->input('type', strtok($publicId, '_'));

        switch ($type) {
            case 'order':
                $subject = Order::where('public_id', $publicId)->withoutGlobalScopes()->first();
                break;

            case 'waypoint':
                $subject = Waypoint::where('public_id', $publicId)->withoutGlobalScopes()->first();
                break;

            case 'entity':
                $subject = Entity::where('public_id', $publicId)->withoutGlobalScopes()->first();
                break;
        }

        if (!$subject) {
            return response()->error('Unable to capture signature data.');
        }

        // create proof instance
        $proof = Proof::create([
            'company_uuid' => session('company'),
            'subject_uuid' => $subject->uuid,
            'subject_type' => Utils::getModelClassName($subject),
            'remarks'      => 'Verified by Signature',
            'raw_data'     => $request->input('signature'),
        ]);

        // set the signature storage path
        $path = 'uploads/' . session('company') . '/signatures/' . $proof->public_id . '.png';

        // upload signature
        // 此前硬编码 disk('s3') 且传 'public' visibility:未配 S3 的部署直接挂;
        // 配了 S3 但(按最佳实践)开了 Block Public Access / 禁用 ACL 的桶,
        // 设 public ACL 会被 AWS 拒。改走默认 disk 且不设 visibility——
        // File::getUrlAttribute() 对 s3 本就发预签名 URL,不需要公开读。
        $disk   = config('filesystems.default');
        $bucket = config('filesystems.disks.' . $disk . '.bucket', config('filesystems.disks.s3.bucket'));
        Storage::disk($disk)->put($path, base64_decode($signature));

        // create file record for upload
        // 'size' 写不进去:files 表列名是 file_size 且 'size' 不在 fillable。
        $file = File::create([
            'company_uuid'      => session('company'),
            'uploader_uuid'     => session('user'),
            'name'              => basename($path),
            'original_filename' => basename($path),
            'extension'         => 'png',
            'content_type'      => 'image/png',
            'disk'              => $disk,
            'path'              => $path,
            'bucket'            => $bucket,
            'type'              => 'signature',
            'file_size'         => Utils::getBase64ImageSize($signature),
        ])->setKey($proof);

        // set file to proof
        $proof->file_uuid = $file->uuid;
        $proof->save();

        return response()->json([
            'status' => 'success',
            'proof'  => $proof->public_id,
        ]);
    }
}
