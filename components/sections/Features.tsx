import { Paintbrush, Zap, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      icon: <Paintbrush className="h-6 w-6 text-fuchsia-400" />,
      title: "Unique Styles",
      description: "Choose from multiple styles including 3D, Anime, Pixel Art, and more. Our AI adapts to your creative vision.",
    },
    {
      icon: <Zap className="h-6 w-6 text-violet-400" />,
      title: "Lightning Fast",
      description: "Generate high-quality stickers in just a few seconds. No more waiting hours for premium designs.",
    },
    {
      icon: <Layers className="h-6 w-6 text-pink-400" />,
      title: "High Resolution",
      description: "All stickers are generated in high resolution with transparent backgrounds, ready for your projects.",
    },
  ];

  return (
    <section id="features" className="w-full py-24 bg-background/50 relative">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Crafted for <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400">Creators</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to create the perfect sticker. Built with cutting edge AI models and a focus on quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-none overflow-hidden group">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
