interface JotformEmbedProps {
  className?: string;
  height?: string;
}

export function JotformEmbed({ className = "", height = "600px" }: JotformEmbedProps) {
  return (
    <div className={`w-full ${className}`}>
      <iframe
        title="Contact Form"
        src="https://form.jotform.com/252645641478162"
        className="w-full border-0 rounded-lg"
        style={{ height }}
        allow="geolocation; microphone; camera"
      />
    </div>
  );
}
