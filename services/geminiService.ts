
import { GoogleGenAI, Type } from "@google/genai";
import type { Species } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const speciesSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'The binomial Latin-esque name of the species (e.g., Thalassoraptor viridis).',
    },
    appearance: {
      type: Type.STRING,
      description: 'A detailed physical description covering morphology, color, size, and any special organs or features.',
    },
    habitat: {
      type: Type.STRING,
      description: 'A description of the species\' natural environment, including planet type, biome, and atmospheric conditions.',
    },
    behaviour: {
      type: Type.STRING,
      description: 'An overview of the species\' typical behaviors, such as diet (predator/prey), social structure, and reproductive cycle.',
    },
    evolution_story: {
      type: Type.STRING,
      description: 'A single concise paragraph explaining the plausible evolutionary path this species took to develop its current traits.',
    },
    biome_soundtrack_prompt: {
        type: Type.STRING,
        description: "A descriptive prompt for an AI music generator to create an ambient soundtrack for the species' biome (e.g., 'Eerie ambient synth pads, with the sound of dripping water in a vast cavern, and the distant clicks of chitinous creatures')."
    }
  },
  required: ['name', 'appearance', 'habitat', 'behaviour', 'evolution_story', 'biome_soundtrack_prompt']
};

export async function generateSpeciesData(previousSpecies: Species | null): Promise<Species> {
  const mutationPrompt = previousSpecies
    ? `This new species is a mutation or evolutionary descendant of the following species. It should share some traits but also possess distinct new adaptations. Previous Species: ${JSON.stringify(previousSpecies)}`
    : 'The species should be completely new and unique.';

  const prompt = `
    You are the Xenoform Algorithm, a procedural generator for fictional alien life. Your purpose is to create scientifically plausible yet wildly imaginative species.
    Generate a single, unique alien species based on these rules.
    ${mutationPrompt}
    Respond ONLY with a single, valid JSON object that conforms to the provided schema. Do not include any other text, markdown, or explanations before or after the JSON.
    The binomial name should sound plausible.
    The evolution story must be a single, concise paragraph.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: speciesSchema,
    }
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText) as Species;
}

export async function generateEcosystemData(): Promise<Species[]> {
  const prompt = `
    You are the Xenoform Algorithm, a procedural generator for fictional alien life. Your purpose is to create scientifically plausible yet wildly imaginative ecosystems.
    Generate a small, interconnected ecosystem of 5 alien species.
    The ecosystem must be coherent, with clear predator-prey relationships, symbiotic interactions, or competition for resources.
    For each species, provide a JSON object according to the specified schema.
    Respond ONLY with a single, valid JSON object containing a key "ecosystem" which is an array of these 5 species objects. Do not include any other text, markdown, or explanations before or after the JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ecosystem: {
            type: Type.ARRAY,
            items: speciesSchema
          }
        },
        required: ['ecosystem']
      }
    }
  });

  const jsonText = response.text.trim();
  const result = JSON.parse(jsonText);
  return result.ecosystem as Species[];
}

export async function generateSpeciesImage(species: Species): Promise<string> {
    const prompt = `
    Create a photorealistic, high-detail digital illustration of a newly discovered alien species for a biology codex.
    Style: David Attenborough's "Planet Earth" documentary style, scientific illustration, high detail, dramatic lighting, photorealistic.
    Subject Description: ${species.appearance}.
    Environment: The creature is depicted in its natural habitat: ${species.habitat}.
    Do not include any text, labels, watermarks, or borders in the image. The image should be focused solely on the creature in its environment.
    `;

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          aspectRatio: '16:9',
          outputMimeType: 'image/jpeg',
        },
    });
    
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
}
