<?php

// load all routes from the api/ directory
foreach (glob(__DIR__ . '/api/*.php') as $file) {
    require $file;
}
