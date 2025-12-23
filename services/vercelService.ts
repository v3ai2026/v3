
import { GeneratedFile, DeploymentStatus } from "../types";

export const deployToVercel = async (
  files: GeneratedFile[],
  vercelToken: string,
  projectName: string
): Promise<DeploymentStatus> => {
  // To deploy to Vercel via API, we send a list of files to their deployment endpoint
  // Reference: https://vercel.com/docs/rest-api/endpoints#create-a-new-deployment

  const formattedFiles = files.map(f => ({
    file: f.path,
    data: f.content
  }));

  const response = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: projectName,
      files: formattedFiles,
      projectSettings: {
        framework: 'nextjs'
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Deployment failed');
  }

  const data = await response.json();
  return {
    id: data.id,
    url: data.url,
    state: data.readyState || 'INITIALIZING',
    createdAt: Date.now()
  };
};

export const checkDeploymentStatus = async (id: string, vercelToken: string): Promise<DeploymentStatus> => {
  const response = await fetch(`https://api.vercel.com/v13/deployments/${id}`, {
    headers: { 'Authorization': `Bearer ${vercelToken}` }
  });
  const data = await response.json();
  return {
    id: data.id,
    url: data.url,
    state: data.readyState,
    createdAt: data.createdAt
  };
};
