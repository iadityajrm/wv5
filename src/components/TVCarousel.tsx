
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

interface TVCarouselProps {
  customImages?: string[];
}

const defaultCarouselItems: CarouselItem[] = [
  {
    id: 1,
    title: "Smart Restaurant Ordering",
    description: "Experience seamless dining with Atlas AI. Simply speak your order naturally and let our intelligent assistant handle menu recommendations, dietary preferences, and complete order processing with restaurant systems.",
    image: "/lovable-uploads/ef5a1f6f-4ce1-4183-9610-66d923750591.png",
    category: "Restaurant AI"
  },
  {
    id: 2,
    title: "Home Assistant Control",
    description: "Transform your smart home experience with Atlas. Control lights, temperature, security systems, and entertainment devices through natural conversation. Your home responds intelligently to your voice commands.",
    image: "/lovable-uploads/8acfad30-aa90-4edd-b779-aafd43058584.png",
    category: "Smart Home"
  },
  {
    id: 3,
    title: "Intelligent Function Calling",
    description: "Atlas leverages advanced Gemini AI to understand context and execute complex multi-step tasks. From booking appointments to managing calendars, experience the future of AI-powered automation.",
    image: "/lovable-uploads/ada582c7-709e-480e-8494-1461b602567c.png",
    category: "AI Automation"
  },
  {
    id: 4,
    title: "Voice-Powered Navigation",
    description: "Navigate through applications effortlessly with Atlas voice control. Switch between apps, search content, and control your entertainment system using natural speech recognition technology.",
    image: "/lovable-uploads/47497b1d-b110-4737-abe3-ebf01ae8c243.png",
    category: "Voice Control"
  }
];

const TVCarousel: React.FC<TVCarouselProps> = ({ customImages }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const autoScrollRef = useRef<NodeJS.Timeout>();

  // Create carousel items with custom images if provided
  const carouselItems = customImages && customImages.length === 4 
    ? defaultCarouselItems.map((item, index) => ({
        ...item,
        image: customImages[index]
      }))
    : defaultCarouselItems;

  useEffect(() => {
    if (!api) return;

    // Auto-scroll every 5 seconds
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        api.scrollNext();
      }, 5000);
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };

    // Start auto-scroll
    startAutoScroll();

    // Listen for manual navigation to restart auto-scroll timer
    api.on('select', () => {
      stopAutoScroll();
      startAutoScroll();
    });

    // Keyboard navigation support
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle if carousel section is focused
      const navigation = (window as any).currentNavigation;
      if (navigation?.currentSection === 'carousel') {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          stopAutoScroll();
          api.scrollPrev();
          startAutoScroll();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          stopAutoScroll();
          api.scrollNext();
          startAutoScroll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      stopAutoScroll();
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [api]);

  return (
    <Carousel className="w-full" setApi={setApi}>
      <CarouselContent>
        {carouselItems.map(item => (
          <CarouselItem key={item.id}>
            <Card className="relative overflow-hidden border-none bg-transparent">
              <div className="relative h-[500px] w-full">
                {/* Background image */}
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 p-8 text-white max-w-lg">
                  <div className="text-sm text-gray-300 mb-2 uppercase tracking-wider">{item.category}</div>
                  <h2 className="text-5xl md:text-6xl font-black mb-4">{item.title}</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      <CarouselPrevious data-carousel-prev />
      <CarouselNext data-carousel-next />
    </Carousel>
  );
};

export default TVCarousel;
