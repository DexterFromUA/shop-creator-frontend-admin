import { productService } from './graphql';

const uploadFilesToStore = async (files = [], storeId) => {
  const fileNames = files.map((f) => f.name);
  const fileTypes = files.map((f) => f.type);
  const presignedData = await productService.uploadFiles(storeId, fileNames, fileTypes);
  const fileUrls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { uploadUrl, fileKey } = presignedData[i];

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Filed to load ${file.name} to storage`);
    }
    fileUrls.push(fileKey);
  }

  return fileUrls;
};

const removeFilesFromStore = async () => {};

export { uploadFilesToStore, removeFilesFromStore };
