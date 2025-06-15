import { TypeOf } from './../node_modules/zod/dist/types/v3/types.d';
import { GoogleGenAI } from "@google/genai";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

const ai = new GoogleGenAI({
  apiKey: Constants.expoConfig?.extra?.GENAI_KEY
});

export const getBase64 = async (uri: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64;
};

export const parseLabReportFromImage = async (
  base64Image: string,
  mimeType = "image/jpeg"
) => {
  const prompt = `
Extract all relevant lab report information from the provided image into a JSON object that strictly adheres to the following schema:

interface ITest {
  testName: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  method?: string;
  conversionFactor?: string;
}
interface ILabReport {
  sampleNo: string;
  date: string;
  specimen?: string;
  patient: string;
  tests: ITest[];
}
Return only valid JSON. No explanation or extra text. Example of Expected Output Structure:

json
{
  "sampleNo": "", // Example, if not found
  "date": "",     // Example, if not found
  "specimen": "", // Example, if not found
  "patient": "",  // Example, if not found
  "tests": [
    {
      "testName": "Colour",
      "result": "Light Yellow"
    },
    {
      "testName": "Transparency",
      "result": "Clear"
    },
    {
      "testName": "pH",
      "result": "5.00"
    },
    {
      "testName": "Sugar",
      "result": "Nil",
      "unit": "mg/dL",
      "referenceRange": "<50 = Normal,\n50 = Trace,\n100 = 1+,\n250 = 2+,\n500 = 3+,\n2000 = 4+"
    },
    {
      "testName": "Pus Cells",
      "result": "0",
      "unit": "/HPF"
    },
    {
      "testName": "RBCs",
      "result": "Nil",
      "unit": "/HPF"
    },
    {
      "testName": "Epithelial Cells",
      "result": "0",
      "unit": "/HPF"
    },
    {
      "testName": "Crystals",
      "result": "0",
      "unit": "/HPF"
    },
    {
      "testName": "Casts",
      "result": "0",
      "unit": "/HPF"
    },
    {
      "testName": "Protein",
      "result": "Nil",
      "unit": "mg/dL",
      "referenceRange": "<15=Normal,\n15=Trace,\n30=1+,\n100=2+,\n300=3+,\n1000=4+",
      "conversionFactor": "X 10 (mg/L)"
    }
  ]
}`;

  const result = await ai.models.generateContent({
    model: "gemma-3-4b-it",
    contents: [
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      { text: prompt },
    ],
  });

  const jsonString = result.text?.trim();


  if (!jsonString) {
    console.error("No text returned from GenAI.");
    return null;
  }
  console.log(jsonString);

  try {
    const cleaned = jsonString.replace(/^```json\n/, "").replace(/\n```$/, "");
    // console.log(cleaned);
    const parsed = JSON.parse(cleaned);
    console.log(JSON.stringify(parsed, null,4));
    return parsed;
  } catch (e) {
    console.error("JSON parse error:", e);
    return null;
  }

};
