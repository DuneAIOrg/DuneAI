import SDWebUI from "node-sd-webui";
import { throttledOperation } from "../utils/throttling";

const sdWebUI = SDWebUI({
  apiUrl: "http://127.0.0.1:7860",
});

const generateImage = async (prompt: string, options: any = {}) => {
  try {
    // Include the options in the API call
    const result = await sdWebUI.txt2img({ prompt, ...options });
    return result; //.imageUrl; // Adjust based on the actual API response
  } catch (error) {
    console.error("Error during image generation:", error);
    throw error;
  }
};

export const ask = async (
  prompt: string | Record<string, any>,
  options?: any,
) => {
  if (typeof prompt === "object") {
    options = prompt;
    prompt = options.prompt;
  }
  return await throttledOperation(
    () => generateImage(prompt as string, options),
    {
      id: prompt, // Use prompt as the unique identifier for throttling purposes
    },
  );
};
