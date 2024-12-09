import { gql } from "@apollo/client";

export const TASK_UPDATED = gql`
  subscription TaskUpdated {
    taskUpdated {
      id
      title
      status
    }
  }
`;
