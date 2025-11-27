@extends('layouts.app')

@section('content')



    <div class="main-banner reg">
        <div class="container">

            @include('web.components.header.logoAuthBar')

            <div class="reg">
                <div class="section-title">
                    <h1>registration</h1>
                </div>
                <form class="reg-wrapper" method="POST" action="{{ route('register',app()->getLocale()) }}">
                    @csrf

                    <div class="radios">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="exampleRadio" id="exampleRadio1"
                                   value="option1">
                            <label class="form-check-label" for="exampleRadio1">customer</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="exampleRadio" id="exampleRadio2"
                                   value="option2">
                            <label class="form-check-label" for="exampleRadio2">Executive</label>
                        </div>
                    </div>
                    <div>
                        <input id="name" placeholder="surname" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>

                        @error('name')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>
                    <div>
                        <input id="email" placeholder="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                        @error('email')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>

                    <div>
                        <input id="phone" placeholder="phone" type="text" class="form-control @error('phone') is-invalid @enderror" name="phone" value="{{ old('phone') }}" required autocomplete="phone">

                        @error('phone')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div>
                        <input id="password" placeholder="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">
                        @error('password')
                        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                        @enderror
                    </div>
                    <div>
                        <input id="password-confirm" placeholder="password confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">

                    </div>
                    <button class="enter-btn" type="submit">Register</button>

                </form>
            </div>
        </div>
    </div>



@endsection
