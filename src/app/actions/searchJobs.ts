"use server";

export async function searchJobs(query: string) {
  if (!query) {
    return { success: false, error: "Query is required" };
  }

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return { success: false, error: "Serper API Key is not configured on the server." };
  }

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: `${query}`,
        num: 15,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Serper API Error:", error);
      return { success: false, error: "Failed to fetch jobs from search provider." };
    }

    const data = await response.json();
    
    // Parse the response for organic results
    const results = (data.organic || []).map((item: any) => ({
      title: item.title || "Unknown Title",
      companyName: item.title?.split("-")[1]?.trim() || "Unknown Company", // A heuristic since organic results don't guarantee structured company name
      location: "Remote/Various", // Heuristic fallback
      snippet: item.snippet || "No description provided.",
      link: item.link || "#",
    }));

    return { success: true, data: results };
  } catch (error) {
    console.error("Failed to search jobs:", error);
    return { success: false, error: "An unexpected error occurred while searching for jobs." };
  }
}
