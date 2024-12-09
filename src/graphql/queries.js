import { gql } from "@apollo/client";

// Queries
export const GET_USERS = gql`
  query GetUsers {
    users {
      id_user
      first_name
      last_name
      email
      role
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id_task
      user_id
      title
      description
      status
      priority
      deadline
    }
  }
`;
