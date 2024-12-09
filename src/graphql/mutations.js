import { gql } from "@apollo/client";

// Mutations
export const CREATE_USER = gql`
  mutation CreateUser(
    $first_name: String!
    $last_name: String!
    $email: String!
    $password: String!
    $role: String!
  ) {
    createUser(
      first_name: $first_name
      last_name: $last_name
      email: $email
      password: $password
      role: $role
    ) {
      id_user
      first_name
      last_name
      email
      role
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String
    $status: String
    $priority: String
    $deadline: String
    $user_id: Int
  ) {
    createTask(
      title: $title
      description: $description
      status: $status
      priority: $priority
      deadline: $deadline
      user_id: $user_id
    ) {
      id_task
      title
      description
      status
      priority
      deadline
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password)
  }
`;
