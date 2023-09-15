/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addedVideo = /* GraphQL */ `
  subscription AddedVideo($id: String!, $name: String!, $owner: String!) {
    addedVideo(id: $id, name: $name, owner: $owner) {
      id
      name
      owner
      url
      __typename
    }
  }
`;
export const requestedVideo = /* GraphQL */ `
  subscription RequestedVideo {
    requestedVideo {
      id
      name
      owner
      url
      __typename
    }
  }
`;
