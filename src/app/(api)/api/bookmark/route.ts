import ResponseDTO from "lib/response";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = new URLSearchParams(url.search);

  const target = params.get("target");

  if (!target) {
    return ResponseDTO.status(400).json({
      result: false,
      error: {
        title: "Bad Request",
        message: "target is required",
      },
    });
  }

  const response = await fetch(target, {
    headers: {
      "Accept-Encoding": "gzip, deflate",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    return ResponseDTO.status(500).json({
      result: false,
      error: {
        title: "Internal Server Error",
        message: "Failed to fetch target",
      },
    });
  }
}
