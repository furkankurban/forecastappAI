# Samsung Galaxy Store Deployment Guide

This guide explains how to build your Android application and publish it to the Samsung Galaxy Store.

## 1. Prerequisites

- **Android Studio**: You must have Android Studio installed on your computer.
- **Samsung Seller Account**: Register at [Samsung Seller Portal](https://seller.samsungapps.com/).

## 2. Building the APK/AAB

1.  **Open the Project**:
    Run the following command in your terminal to open the Android project in Android Studio:
    ```bash
    npx cap open android
    ```

2.  **Generate Signed Bundle/APK**:
    - In Android Studio, go to **Build > Generate Signed Bundle / APK**.
    - Select **Android App Bundle** (recommended) or **APK**.
    - Click **Next**.
    - **Key Store Path**: Create a new key store if you don't have one. **Keep this file safe!** You will need it for every update.
    - Fill in the required fields (passwords, alias, etc.).
    - Select **Release** build variant.
    - Click **Create** / **Finish**.

3.  **Locate the File**:
    - Android Studio will notify you when the build is complete. Click "Locate" to find your `.aab` or `.apk` file.

## 3. Publishing to Samsung Galaxy Store

1.  **Log in**: Go to [Samsung Seller Portal](https://seller.samsungapps.com/).
2.  **Add New Application**:
    - Click **Add New Application**.
    - Select **Android**.
    - Choose **Default Language** (e.g., Turkish).
    - Click **Next**.
3.  **App Information**:
    - **App Title**: Hava Durumu (or your preferred name).
    - **Description**: Enter a compelling description of your app.
    - **Icon**: Upload your app icon (512x512 PNG).
    - **Screenshots**: Upload at least 4 screenshots of your app.
4.  **Binary**:
    - Upload the `.aab` or `.apk` file you generated in Step 2.
    - Select the compatible devices (usually select all).
5.  **Submit**:
    - Review all information.
    - Click **Submit** to send your app for review.

## 4. Updating Your App

When you make changes to your code:

1.  **Update Code**: Make your changes in the React project.
2.  **Build & Sync**:
    Run these commands in your terminal:
    ```bash
    npm run build
    npx cap sync
    ```
3.  **Version Bump**:
    - Open `android/app/build.gradle` (or do this in Android Studio Project Structure).
    - Increment `versionCode` (e.g., 1 -> 2) and `versionName` (e.g., 1.0.0 -> 1.0.1).
4.  **Rebuild**: Repeat Step 2 (Generate Signed Bundle/APK).
5.  **Upload Update**: Go to Samsung Seller Portal, select your app, and upload the new binary.
