<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use League\Fractal\Manager;
use League\Fractal\Resource\Collection;
use League\Fractal\Resource\Item;
use League\Fractal\Serializer\DataArraySerializer;

class BaseApiController extends Controller
{
    protected Manager $fractal;

    public function __construct()
    {
        $this->fractal = new Manager();
        $this->fractal->setSerializer(new DataArraySerializer());
    }

    protected function respondWithItem($item, $transformer, $statusCode = 200): JsonResponse
    {
        $resource = new Item($item, $transformer);
        $data = $this->fractal->createData($resource)->toArray();

        return response()->json($data, $statusCode);
    }

    protected function respondWithCollection($collection, $transformer, $statusCode = 200): JsonResponse
    {
        $resource = new Collection($collection, $transformer);
        $data = $this->fractal->createData($resource)->toArray();

        return response()->json($data, $statusCode);
    }

    protected function respondWithSuccess($message = 'Success', $data = [], $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    protected function respondWithError($message = 'Error', $errors = [], $statusCode = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }
}

