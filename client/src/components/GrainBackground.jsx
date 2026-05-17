import Grainient from "./Grainient";

function GrainBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Grainient
        color1="#26515c"
        color2="#010102"
        color3="#06B6D4"
        timeSpeed={0.25}
        colorBalance={0}
        warpStrength={1}
        warpFrequency={5}
        warpSpeed={2}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.05}
        rotationAmount={500}
        noiseScale={2}
        grainAmount={0.1}
        grainScale={2}
        grainAnimated={false}
        contrast={1.5}
        gamma={1}
        saturation={1}
        centerX={0}
        centerY={0}
        zoom={0.9}
      />
    </div>
  );
}

export default GrainBackground;