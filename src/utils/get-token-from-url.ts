export function getTokensFromUrl(location:any) {
  const hash = location.hash.substring(1); // حذف #
  const params = new URLSearchParams(hash);

  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  return { access_token, refresh_token };
}