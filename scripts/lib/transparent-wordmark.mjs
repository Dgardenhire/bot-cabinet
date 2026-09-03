import sharp from "sharp";

const WORDMARK_BACKGROUND_THRESHOLD = 42;
const WORDMARK_ALPHA_SCALE = 4;

export async function buildTransparentWordmark(wordmarkPath, width) {
  const { data, info } = await sharp(wordmarkPath)
    .resize({ width })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (info.channels !== 3) {
    throw new Error(`wordmark: expected 3 raw channels, received ${info.channels}`);
  }

  const alpha = Buffer.alloc(info.width * info.height);

  for (let sourceOffset = 0, alphaOffset = 0; sourceOffset < data.length; sourceOffset += info.channels, alphaOffset += 1) {
    const red = data[sourceOffset];
    const green = data[sourceOffset + 1];
    const blue = data[sourceOffset + 2];
    alpha[alphaOffset] = Math.max(
      0,
      Math.min(
        255,
        Math.round(
          (Math.max(red, green, blue) - WORDMARK_BACKGROUND_THRESHOLD) *
            WORDMARK_ALPHA_SCALE,
        ),
      ),
    );
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 3 },
  })
    .joinChannel(alpha, {
      raw: { width: info.width, height: info.height, channels: 1 },
    })
    .png()
    .toBuffer();
}
