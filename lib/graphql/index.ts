import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "@auth0/nextjs-auth0";
export * from "./query";
export * from "./mutation";
const GRAPHQL_API_URL =
  process.env.GRAPHQL_API_URL || "http://localhost:8004/graphql";

export async function graphqlClient<T>(
  query: string,
  variables?: any,
  req?: any,
  res?: any
): Promise<T|null> {
  try {
    let accessToken = "";

    if (req && res) {
      // Server-side
      const { accessToken: token } = await getAccessToken(req, res);
      accessToken = token || "";
    } else if (typeof window !== "undefined") {
      // Client-side
      const response = await fetch("/auth/access-token");
      if (response.ok) {
        const data = await response.json();
        accessToken = data.accessToken || "";
      }
    }

    const client = new GraphQLClient(GRAPHQL_API_URL, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "Content-Type": "application/json",
      },
    });

    return await client.request(query, variables);
  } catch (error) {
    console.error("GraphQL request error:", error);
    throw error;
  }
}

