export const HeadlingUnderline = ({ title }: { title: string }) => (
  <h2 className="font-heading relative col-span-full mb-8 inline-block text-2xl font-semibold text-gray-800">
    {title}
    <div className="absolute -bottom-2 left-0 h-1 w-24 bg-primary" />
  </h2>
);
