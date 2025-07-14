#!/usr/bin/env python3
"""
Google Vision API Key Test Script
Run this to verify your API key is working correctly.
"""

import os
import sys
import requests
import base64
from pathlib import Path

def test_google_vision_api():
    """Test Google Vision API with a simple image"""
    
    # Load API key from environment
    api_key = os.getenv('GOOGLE_VISION_API_KEY')
    
    if not api_key or api_key == 'your_google_vision_api_key_here':
        print("❌ Error: Please set your GOOGLE_VISION_API_KEY in the .env file")
        print("📝 Get your API key from: https://console.cloud.google.com/apis/credentials")
        return False
    
    print(f"🔑 Using API key: {api_key[:10]}...{api_key[-4:]}")
    
    # Create a simple test image (1x1 pixel PNG)
    # This is a minimal valid PNG file for testing
    test_image_data = base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    )
    
    # Encode for API
    base64_image = base64.b64encode(test_image_data).decode('utf-8')
    
    # Prepare API request
    url = f"https://vision.googleapis.com/v1/images:annotate?key={api_key}"
    
    payload = {
        "requests": [{
            "image": {"content": base64_image},
            "features": [{"type": "LABEL_DETECTION", "maxResults": 5}]
        }]
    }
    
    try:
        print("🚀 Testing Google Vision API...")
        response = requests.post(url, json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Success! Google Vision API is working correctly.")
            print(f"📊 Response: {data}")
            return True
        elif response.status_code == 403:
            print("❌ Error 403: API key is invalid or Vision API is not enabled")
            print("🔧 Solutions:")
            print("   1. Check your API key is correct")
            print("   2. Enable Cloud Vision API in Google Cloud Console")
            print("   3. Make sure billing is enabled for your project")
        elif response.status_code == 400:
            print("❌ Error 400: Bad request - check your API key format")
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
        
        return False
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return False

def main():
    """Main function"""
    print("🧪 Google Vision API Test Script")
    print("=" * 50)
    
    # Load environment variables
    env_file = Path('.env')
    if env_file.exists():
        from dotenv import load_dotenv
        load_dotenv()
        print("✅ Loaded .env file")
    else:
        print("⚠️  No .env file found")
    
    # Test the API
    success = test_google_vision_api()
    
    if success:
        print("\n🎉 Your Google Vision API is ready to use!")
        print("💡 You can now use real AI detection in Walmart IQ")
    else:
        print("\n🔧 Setup Instructions:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Create/select a project")
        print("3. Enable Cloud Vision API")
        print("4. Create an API key")
        print("5. Add it to your .env file as GOOGLE_VISION_API_KEY")

if __name__ == "__main__":
    main()
