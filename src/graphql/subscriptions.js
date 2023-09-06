/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addedVideo = /* GraphQL */ `
  subscription AddedVideo($name: String!, $owner: String!) {
    addedVideo(name: $name, owner: $owner) {
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
      name
      owner
      url
      __typename
    }
  }
`;
