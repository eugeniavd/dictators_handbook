<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle : 'MMMM Project'; ?></title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
    
    <!-- Design theme -->
    <link id="themeStylesheet" rel="stylesheet" href="/css/gzhel.css">
    
    <style>
        .map-container {
            position: fixed;
            top: 56px; /* Height of the navbar */
            left: 0;
            right: 0;
            height: 400px;
            z-index: 100;
            background-color: white;
        }
        .placeholder-map {
            background-color: #e9ecef;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .content-wrapper {
            margin-top: 456px; /* navbar height (56px) + map height (400px) */
        }
        .intro-section {
            padding: 3rem 0;
            background-color: #f8f9fa;
            margin-bottom: 2rem;
        }
        .dropdown-menu .submenu {
            display: none;
            position: absolute;
            left: 100%;
            top: 0;
        }
        .dropdown-item:hover > .submenu {
            display: block;
        }
    </style>

    <!-- Addidg JavaScript file with additional functions -->
    <script src="/utilities/functions.js" defer></script>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#">MMMM Project</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="issuesDropdown" role="button" data-bs-toggle="dropdown">
                            Issues
                        </a>
                        <ul class="dropdown-menu">
                            <li class="dropdown-submenu">
                                <a class="dropdown-item dropdown-toggle" href="#">Stalin</a>
                                <ul class="dropdown-menu submenu">
                                    <li><a class="dropdown-item" href="Issues/1/last_days_of_soviet_dictator.html">The last days of the Soviet dictator</a></li>
                                    <li><a class="dropdown-item" href="Issues/1/joseph_stalin_paranoid_purge.html">Joseph Stalin's Paranoid Purge</a></li>
                                    <li><a class="dropdown-item" href="Issues/1/world_that_made_stalin.html">The World That Made Stalin — and the World That Stalin Made</a></li>
                                </ul>
                            </li>
                            <li class="dropdown-submenu">
                                <a class="dropdown-item dropdown-toggle" href="#">Mao</a>
                                <ul class="dropdown-menu submenu">
                                    <li><a class="dropdown-item" href="Issues/2/house-of-mao.html">House of Mao: How Consumerism and Patriotism Collide in the Chairman's Hometown</a></li>
                                    <li><a class="dropdown-item" href="#">New Bio Offers Sinister View of Chairman Mao</a></li>
                                    <li><a class="dropdown-item" href="#">Chinese celebrity chef vows to never cook egg fried rice again after nationalist backlash</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">About</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="styleDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Change Design
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="styleDropdown">
                            <li>
                                <a class="dropdown-item" href="#" onclick="switchStyle('/css/gzhel.css')">
                                Old Russian Gzhel
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" onclick="switchStyle('/css/suprematism.css')">
                                Suprematism
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" onclick="switchStyle('#')">
                                Design 3
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" onclick="switchStyle('#')">
                                Design 4
                                </a>
                            </li>
                </ul>
            </div>
        </div>
    </nav>
    
