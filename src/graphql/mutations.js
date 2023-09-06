/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addVideo = /* GraphQL */ `
  mutation AddVideo($name: String!, $owner: String!, $url: String!) {
    addVideo(name: $name, owner: $owner, url: $url) {
      name
      owner
      url
      __typename
    }
  }
`;
export const requestVideo = /* GraphQL */ `
  mutation RequestVideo($name: String!, $owner: String!) {
    requestVideo(name: $name, owner: $owner) {
      name
      owner
      url
      __typename
    }
  }
`;
