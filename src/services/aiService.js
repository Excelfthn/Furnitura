export const generateInterior = async (imageBase64, userPrompt, apiKey) => {
    if (!apiKey) {
        throw new Error("API Key is missing.");
    }

    const constrainedPrompt = `Generate a photorealistic interior design image based on the reference room image provided. 

REQUIREMENTS:
- Keep the exact same room layout, walls, windows, doors, and floor from the reference image
- Keep the same lighting direction and color temperature as the reference
- ${userPrompt}
- Add realistic contact shadows on the floor for all furniture
- Use high-fidelity textures: matte oak, brushed metal, or woven linen
- Style: Minimalist, high-end interior design magazine aesthetic
- Maintain photorealistic quality throughout

Generate the complete room scene with these additions.`.trim();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.href,
            "X-Title": "Furnitura",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "black-forest-labs/flux.2-pro",
            "modalities": ["image", "text"], // Required for image generation
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": constrainedPrompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": imageBase64
                            }
                        }
                    ]
                }
            ]
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // DETAILED LOGGING FOR DEBUGGING
    console.log("=== FULL API RESPONSE ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("=== Response Keys:", Object.keys(data));

    // Check multiple possible response structures

    // Structure 1: Images array (Flux 2 Pro actual format!)
    if (data.choices && data.choices[0]?.message?.images && data.choices[0].message.images[0]?.image_url?.url) {
        const imageUrl = data.choices[0].message.images[0].image_url.url;
        console.log("✓ Found: choices[0].message.images[0].image_url.url");
        return { imageUrl: imageUrl };
    }

    // Structure 2: Standard chat completion with content
    if (data.choices && data.choices[0]?.message?.content) {
        const content = data.choices[0].message.content;
        console.log("✓ Found: choices[0].message.content");
        console.log("Content type:", typeof content);
        console.log("Content preview:", content.substring(0, 200));

        // Base64 data URL
        if (content.startsWith('data:image/')) {
            console.log("✓ Detected: Base64 data URL");
            return { imageUrl: content };
        }

        // Markdown image format
        const urlMatch = content.match(/\((https?:\/\/.*?)\)/);
        if (urlMatch) {
            console.log("✓ Detected: Markdown image URL");
            return { imageUrl: urlMatch[1] };
        }

        // Plain URL
        if (content.startsWith('http')) {
            console.log("✓ Detected: Plain URL");
            return { imageUrl: content };
        }

        console.error("✗ Content doesn't match expected image format");
        console.error("Content:", content);
        throw new Error("Content is not a valid image. Check console for details.");
    }

    // Structure 2: Direct data array (DALL-E style)
    if (data.data && Array.isArray(data.data) && data.data[0]) {
        console.log("✓ Found: data array");
        if (data.data[0].url) {
            return { imageUrl: data.data[0].url };
        }
        if (data.data[0].b64_json) {
            return { imageUrl: `data:image/png;base64,${data.data[0].b64_json}` };
        }
    }

    // If we get here, the response doesn't match any known format
    console.error("✗ Unrecognized response structure");
    console.error("Available keys:", Object.keys(data));
    if (data.choices) console.error("Choices:", data.choices);
    throw new Error(`Unexpected API response format. Check browser console for full details.`);
};
