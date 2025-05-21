<?php

namespace App\Http\Controllers;

use App\Http\Requests\RunCode\RunCodeRequest;
use App\Http\Requests\RunCode\RunTestRequest;
use App\Models\Language;
use Illuminate\Support\Facades\Http;

class RunCodeController extends Controller
{
    protected $language;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Language $language)
    {
        $this->language = $language;
    }

    /**
     * Run code and return the result
     * @group Code Runner
     */
    public function runCode(RunCodeRequest $request)
    {
        $executorUrl = env('EXECUTOR_URL');
        if (!$executorUrl) {
            return response()->json([
                'message' => 'Executor URL not set',
            ], 500);
        }

        $language = $this->language->where('code', $request['language'])->first();
        if (!$language) {
            return response()->json([
                'message' => 'Language not supported',
            ], 400);
        }

        $url = $executorUrl . '/execute/code';

        $response = Http::post($url, [
            'language' => $request['language'],
            'input' => $request['input'],
            'files' => $request['files'],
        ]);

        if ($response->successful()) {
            return response()->json($response->json(), 200);
        }

        $error = $response->json();
        if (is_array($error) && isset($error['error'])) {
            $error = $error['error'];
        }
        return response()->json(['message' => $error], $response->status());
    }

    /**
     * Run collection of test cases
     * @group Code Runner
     */
    public function runTests(RunTestRequest $request)
    {
        $executorUrl = env('EXECUTOR_URL');
        if (!$executorUrl) {
            return response()->json([
                'message' => 'Executor URL not set',
            ], 500);
        }

        $language = $this->language->where('code', $request['language'])->first();
        if (!$language) {
            return response()->json([
                'message' => 'Language not supported',
            ], 400);
        }

        $url = $executorUrl . '/execute/test';

        $response = Http::post($url, [
            'language' => $request['language'],
            'files' => $request['files'],
            'testCases' => $request['testCases'],
        ]);

        if ($response->successful()) {
            return response()->json($response->json(), 200);
        }

        $error = $response->json();
        if (is_array($error) && isset($error['error'])) {
            $error = $error['error'];
        }
        return response()->json(['message' => $error], $response->status());
    }
}
