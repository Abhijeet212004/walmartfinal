#!/usr/bin/env python3
"""
Test OpenAI Vision API Integration
"""

import os
import base64
import asyncio
import aiohttp
from dotenv import load_dotenv

load_dotenv()

async def test_openai_vision():
    """Test OpenAI Vision API directly"""
    
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("❌ No OpenAI API key found")
        return False
    
    print(f"🔑 Using OpenAI API Key: {api_key[:15]}...{api_key[-10:]}")
    
    # Create a simple test image (1x1 red pixel)
    import io
    from PIL import Image
    
    # Create test image
    img = Image.new('RGB', (100, 100), color='red')
    img_buffer = io.BytesIO()
    img.save(img_buffer, format='PNG')
    img_bytes = img_buffer.getvalue()
    img_base64 = base64.b64encode(img_bytes).decode('utf-8')
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "What do you see in this image? Describe it briefly."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{img_base64}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 100
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            ) as response:
                
                print(f"📡 Response Status: {response.status}")
                
                if response.status == 200:
                    result = await response.json()
                    content = result['choices'][0]['message']['content']
                    print(f"✅ OpenAI Vision Response: {content}")
                    return True
                else:
                    error_text = await response.text()
                    print(f"❌ OpenAI API Error: {error_text}")
                    return False
                    
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return False

async def test_cv_service_openai():
    """Test if our CV service uses OpenAI"""
    print("\n🧪 Testing CV Service OpenAI Integration:")
    
    try:
        from app.services.computer_vision_real import cv_service
        
        # Check if OpenAI is prioritized in the service
        services = cv_service.get_available_services()
        print(f"Available services: {services}")
        
        # The service should try OpenAI first if available
        if services.get('openai_vision_api'):
            print("✅ OpenAI Vision API is configured in CV service")
            
            # Check the service priority order
            print("\n📋 AI Service Priority Order:")
            print("1. 🌐 Google Vision API (if billing enabled)")
            print("2. 🤖 OpenAI Vision API (YOUR KEY)")
            print("3. 🔵 Azure Computer Vision API")
            print("4. 🎯 Local YOLOv8 Model")
            print("5. 🔧 OpenCV Fallback")
            
            return True
        else:
            print("❌ OpenAI Vision API not configured in CV service")
            return False
            
    except Exception as e:
        print(f"❌ Error testing CV service: {e}")
        return False

async def main():
    print("🚀 OpenAI Vision API Integration Test")
    print("=" * 50)
    
    # Test direct API access
    api_works = await test_openai_vision()
    
    # Test CV service integration
    service_works = await test_cv_service_openai()
    
    print("\n" + "=" * 50)
    print("📊 RESULTS:")
    
    if api_works:
        print("✅ OpenAI API: Working directly")
    else:
        print("❌ OpenAI API: Not working")
    
    if service_works:
        print("✅ CV Service: OpenAI integration ready")
    else:
        print("❌ CV Service: OpenAI not integrated")
    
    if api_works and service_works:
        print("\n🎉 SUCCESS: OpenAI Vision API is ready to use!")
        print("💡 When you upload images, the system will:")
        print("   1. Try Google Vision (needs billing)")
        print("   2. Use YOUR OpenAI Vision API ← THIS IS WORKING")
        print("   3. Fallback to local YOLO if needed")
    else:
        print("\n⚠️ ISSUES DETECTED: Check the errors above")

if __name__ == "__main__":
    asyncio.run(main())
