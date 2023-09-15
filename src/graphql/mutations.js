/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addVideo = /* GraphQL */ `
  mutation AddVideo(
    $id: String!
    $name: String!
    $owner: String!
    $url: String!
  ) {
    addVideo(id: $id, name: $name, owner: $owner, url: $url) {
      id
      name
      owner
      url
      __typename
    }
  }
`;
export const requestVideo = /* GraphQL */ `
  mutation RequestVideo($id: String!, $name: String!, $owner: String!) {
    requestVideo(id: $id, name: $name, owner: $owner) {
      id
      name
      owner
      url
      __typename
    }
  }
`;
