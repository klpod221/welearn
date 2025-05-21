@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="alert alert-info" role="alert">
                    <h4 class="alert-heading">API Documentation</h4>
                    <p>To get started with the We Learn API, please visit our documentation:</p>
                    <hr>
                    <p class="mb-0"><a href="{{ url('/docs') }}" class="btn btn-primary">View Documentation</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
@endsection
