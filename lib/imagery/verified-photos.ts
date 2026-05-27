/**
 * HTTP-probed Unsplash photo IDs — dead IDs removed (404 causes black SafeImage boxes).
 * Regenerate via: POST /api/pipeline-diagnose + scripts/probe-unsplash-ids (manual).
 */

export const VERIFIED_FRUIT_PHOTO_IDS = new Set([
  "1416879595882-3373a0480b5b",
  "1464965911861-746a04b4bca6",
  "1487376480913-24046456a727",
  "1498579397066-22750a3cb424",
  "1511546865855-fe4788edf4b6",
  "1512621776951-a57141f2eefd",
  "1517260739337-6799d239ce83",
  "1518791841217-8f162f1e1131",
  "1535227798054-e4373ef3795a",
  "1542838132-92c53300491e",
  "1552053831-71594a27632d",
  "1558618666-fcd25c85cd64",
  "1560761098-21f5722ecb14",
  "1565299624946-b28f40a0ae38",
  "1580691155297-c6dfa3ca61c4",
  "1610832958506-aa56368176cf",
  "1619566636858-adf3ef46400b",
  "1628689469838-524a4a973b8e",
  "1631209121750-a9f656d28f46",
  "1635774855717-0aec182f92cc",
  "1641642399576-487909d0ddbc",
  "1658431618300-a69b07fb5782",
  "1665589048355-579bc80169d1",
  "1732959409019-b5979266d02d",
]);

export function isVerifiedPhotoId(registryId: string, photoId: string): boolean {
  if (registryId === "fruit") return VERIFIED_FRUIT_PHOTO_IDS.has(photoId);
  return true;
}
