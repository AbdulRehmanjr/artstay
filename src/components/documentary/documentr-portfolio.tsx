'use client'
import { useState } from "react";
import Image from "next/image";
export const DocumentorPortfolio = ({ portfolio }: { portfolio: DocumentorPortfolioProps }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {portfolio.images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`Portfolio image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="Portfolio image"
              width={800}
              height={600}
              className="object-contain max-h-[90vh] max-w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};