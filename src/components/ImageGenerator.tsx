
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RunwareService } from '@/services/runwareService';
import { toast } from 'sonner';

interface ImageGeneratorProps {
  onImagesGenerated: (images: string[]) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImagesGenerated }) => {
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const imagePrompts = [
    "Professional modern illustration of a person ordering food at a restaurant using AI voice assistant, sleek interface, holographic menu display, futuristic dining experience, clean vector art style, blue and purple color scheme",
    "Professional illustration of smart home control interface, person using voice commands to control lights and devices, modern home automation, clean minimalist design, technology integration, blue and green color palette",
    "Professional illustration of AI function calling system, abstract representation of intelligent automation, data flow visualization, modern tech interface, geometric shapes, purple and blue gradient background",
    "Professional illustration of voice-powered navigation interface, person speaking to control entertainment system, modern UI elements, sound waves visualization, sleek design, blue and teal color scheme"
  ];

  const generateImages = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter your Runware API key');
      return;
    }

    setIsGenerating(true);
    const service = new RunwareService(apiKey);
    const generatedUrls: string[] = [];

    try {
      for (let i = 0; i < imagePrompts.length; i++) {
        toast.info(`Generating image ${i + 1} of ${imagePrompts.length}...`);
        const result = await service.generateImage({
          positivePrompt: imagePrompts[i],
          width: 1920,
          height: 1080,
          numberResults: 1
        });
        generatedUrls.push(result.imageURL);
      }
      
      onImagesGenerated(generatedUrls);
      toast.success('All images generated successfully!');
    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate images. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-black/80 p-4 rounded-lg z-50 max-w-md">
      <h3 className="text-white font-bold mb-2">Generate Carousel Images</h3>
      <p className="text-gray-300 text-sm mb-3">
        Enter your Runware API key to generate professional illustrations for the carousel.
        Get your API key from{' '}
        <a href="https://runware.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
          runware.ai
        </a>
      </p>
      <input
        type="password"
        placeholder="Enter Runware API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="w-full p-2 rounded mb-3 bg-gray-800 text-white border border-gray-600"
      />
      <Button 
        onClick={generateImages} 
        disabled={isGenerating || !apiKey.trim()}
        className="w-full"
      >
        {isGenerating ? 'Generating Images...' : 'Generate Images'}
      </Button>
    </div>
  );
};

export default ImageGenerator;
