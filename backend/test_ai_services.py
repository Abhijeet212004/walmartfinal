#!/usr/bin/env python3
"""
Comprehensive AI Services Test Script
Tests both Google Vision API and OpenAI Vision API
"""

import os
import sys
import requests
import base64
import json
from pathlib import Path
from dotenv import load_dotenv

def create_test_image():
    """Create a simple test image (bottle shape)"""
    # Create a more realistic test image for product detection
    # Base64 encoded image of a simple bottle-like shape
    bottle_image_b64 = """
iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAW
dEVYdENyZWF0aW9uIFRpbWUAMDcvMTQvMjAyNcOpbnkAAAAcSURBVHic7dVBDQAwDAOxuX/RHRQB
jST7M3t7e3t7e3t7e3t7e3t7e3v7C1YgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/1h8AAAAASUVORK5CYII=
""".replace('\n', '').replace(' ', '')
    
    try:
        return base64.b64decode(bottle_image_b64)
    except:
        # Fallback to simple colored square
        return base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABHNCSVQICAgIfAhkiAAAAAlwSFlz"
            "AAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAW"
            "dEVYdENyZWF0aW9uIFRpbWUAMDcvMTQvMjAyNcOpbnkAAAAcSURBVBiVY/z//z8DKYCRgUIwqpAW"
            "FQ4qpEWFAAAGGgD9fxqzKgAAAABJRU5ErkJggg=="
        )

def test_google_vision_api():
    """Test Google Vision API"""
    print("\n🔍 Testing Google Vision API...")
    
    api_key = os.getenv('GOOGLE_VISION_API_KEY')
    
    if not api_key or api_key == 'your_google_vision_api_key_here':
        print("❌ Google Vision API key not configured")
        return False
    
    print(f"🔑 Using API key: {api_key[:10]}...{api_key[-4:]}")
    
    # Create test image
    test_image = create_test_image()
    base64_image = base64.b64encode(test_image).decode('utf-8')
    
    url = f"https://vision.googleapis.com/v1/images:annotate?key={api_key}"
    
    payload = {
        "requests": [{
            "image": {"content": base64_image},
            "features": [
                {"type": "LABEL_DETECTION", "maxResults": 5},
                {"type": "OBJECT_LOCALIZATION", "maxResults": 5}
            ]
        }]
    }
    
    try:
        response = requests.post(url, json=payload, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Google Vision API: SUCCESS!")
            
            # Check for labels
            labels = data.get('responses', [{}])[0].get('labelAnnotations', [])
            objects = data.get('responses', [{}])[0].get('localizedObjectAnnotations', [])
            
            print(f"   📊 Labels detected: {len(labels)}")
            print(f"   🎯 Objects detected: {len(objects)}")
            
            if labels:
                print(f"   🏷️  Top label: {labels[0].get('description', 'Unknown')} ({labels[0].get('score', 0):.2f})")
            
            return True
            
        elif response.status_code == 403:
            error_data = response.json()
            error_message = error_data.get('error', {}).get('message', '')
            
            if 'API_KEY_INVALID' in error_message:
                print("❌ Google Vision API: Invalid API key")
            elif 'not enabled' in error_message.lower():
                print("❌ Google Vision API: Vision API not enabled for this project")
                print("🔧 Enable it at: https://console.cloud.google.com/apis/library/vision.googleapis.com")
            elif 'billing' in error_message.lower():
                print("❌ Google Vision API: Billing not enabled")
                print("🔧 Enable billing at: https://console.cloud.google.com/billing")
            else:
                print(f"❌ Google Vision API: Access denied - {error_message}")
            
            return False
            
        else:
            print(f"❌ Google Vision API: HTTP {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Google Vision API: Network error - {e}")
        return False

def test_openai_vision_api():
    """Test OpenAI Vision API"""
    print("\n🧠 Testing OpenAI Vision API...")
    
    api_key = os.getenv('OPENAI_API_KEY')
    
    if not api_key or api_key == 'your_openai_api_key_here':
        print("❌ OpenAI API key not configured")
        return False
    
    print(f"🔑 Using API key: {api_key[:10]}...{api_key[-4:]}")
    
    # Create test image
    test_image = create_test_image()
    base64_image = base64.b64encode(test_image).decode('utf-8')
    
    url = "https://api.openai.com/v1/chat/completions"
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        "model": "gpt-4o-mini",  # Use the more affordable vision model
        "messages": [{
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "What do you see in this image? Just describe it briefly."
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{base64_image}"}
                }
            ]
        }],
        "max_tokens": 100
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ OpenAI Vision API: SUCCESS!")
            
            content = data.get('choices', [{}])[0].get('message', {}).get('content', '')
            print(f"   🤖 AI Response: {content}")
            
            usage = data.get('usage', {})
            tokens = usage.get('total_tokens', 0)
            print(f"   📊 Tokens used: {tokens}")
            
            return True
            
        elif response.status_code == 401:
            print("❌ OpenAI Vision API: Invalid API key")
            return False
            
        elif response.status_code == 429:
            print("❌ OpenAI Vision API: Rate limit exceeded or insufficient credits")
            return False
            
        elif response.status_code == 400:
            error_data = response.json()
            error_message = error_data.get('error', {}).get('message', '')
            print(f"❌ OpenAI Vision API: Bad request - {error_message}")
            return False
            
        else:
            print(f"❌ OpenAI Vision API: HTTP {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ OpenAI Vision API: Network error - {e}")
        return False

def test_backend_endpoint():
    """Test the backend AI endpoint"""
    print("\n🖥️  Testing Backend AI Endpoint...")
    
    try:
        # Test health endpoint
        response = requests.get('http://localhost:8000/health', timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend: Running successfully!")
            print(f"   🔧 AI Services: {data.get('ai_services', {})}")
            return True
        else:
            print(f"❌ Backend: HTTP {response.status_code}")
            return False
            
    except requests.exceptions.RequestException:
        print("❌ Backend: Not running or unreachable")
        print("🔧 Start with: python main_ai.py")
        return False

def main():
    """Main test function"""
    print("🧪 Walmart IQ - AI Services Test Suite")
    print("=" * 60)
    
    # Load environment variables
    env_file = Path('.env')
    if env_file.exists():
        load_dotenv()
        print("✅ Loaded .env file")
    else:
        print("⚠️  No .env file found")
        return
    
    # Run tests
    results = {}
    results['google_vision'] = test_google_vision_api()
    results['openai_vision'] = test_openai_vision_api()
    results['backend'] = test_backend_endpoint()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    for service, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{service.replace('_', ' ').title():<20} {status}")
    
    print(f"\nOverall: {passed_tests}/{total_tests} services working")
    
    if passed_tests == total_tests:
        print("\n🎉 All AI services are ready!")
        print("💡 Your Walmart IQ system has full AI capabilities!")
    elif passed_tests > 0:
        print(f"\n⚡ {passed_tests} AI service(s) working - system will use available services")
    else:
        print("\n🔧 No AI services working - system will use local OpenCV fallback")
    
    # Next steps
    print("\n🚀 Next Steps:")
    if not results['backend']:
        print("1. Start backend: python -m uvicorn main:app --reload --port 8000")
    if results['google_vision'] or results['openai_vision']:
        print("2. Test Computer Vision page at: http://localhost:5173")
        print("3. Upload product images to see real AI detection!")
    else:
        print("2. Configure at least one AI service for best results")

if __name__ == "__main__":
    main()
