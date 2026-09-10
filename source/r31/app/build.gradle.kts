plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.buttonbox.ble"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.buttonbox.ble.ul"
        minSdk = 26
        targetSdk = 34
        versionCode = 1229
        versionName = "0.12.29-ux-state-31"
    }

    buildTypes {
        debug {
            isMinifyEnabled = false
        }
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // Deliberately dependency-light. The exploratory wrapper uses platform Android APIs.
}
