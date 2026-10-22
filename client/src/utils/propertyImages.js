/**
 * Build displayable image URLs for a property (GridFS via /getImg).
 * Falls back to /property.jpg when nothing usable is stored.
 */
export function propertyImageUrls(property) {
  const ids = property?.propertyImgId || [];
  const types = property?.fileType || [];
  const urls = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (!id) continue;
    const type = types[i] || "image/jpeg";
    if (String(type).includes("pdf")) continue;
    urls.push(`${import.meta.env.VITE_API_URL}/getImg/${id}`);
  }
  if (!urls.length && property?.image?.length) {
    for (const img of property.image) {
      if (img) urls.push(String(img).replace(/"/g, ""));
    }
  }
  return urls;
}

export function propertyThumbUrl(property) {
  return propertyImageUrls(property)[0] || "/property.jpg";
}

export const PROPERTY_IMG_FALLBACK = "/property.jpg";
