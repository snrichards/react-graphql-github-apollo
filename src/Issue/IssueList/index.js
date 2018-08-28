import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withState } from 'recompose';
import IssueItem from '../IssueItem';
import Loading from '../../Loading';
import ErrorMessage from '../../Error';
import { ButtonUnobtrusive } from '../../Button';
import './style.css';
import FetchMore from '../../FetchMore';

const GET_ISSUES_OF_REPOSITORY = gql`
  query($repositoryOwner: String!, $repositoryName: String!, $issueState: IssueState!, $cursor: String) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, after: $cursor, states: [$issueState]) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const updateQuery = (perviousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return perviousResult;
  }

  return {
    ...perviousResult,
    repository: {
      ...perviousResult.repository,
      issues: {
        ...perviousResult.repository.issues,
        ...fetchMoreResult.repository.issues,
        edges: [...perviousResult.repository.issues.edges, ...fetchMoreResult.repository.issues.edges],
      },
    },
  };
};

const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

const isShow = (issueState) => issueState !== ISSUE_STATES.NONE;

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: 'Show Open Issues',
  [ISSUE_STATES.OPEN]: 'Show Closed Issues',
  [ISSUE_STATES.CLOSED]: 'Hide Issues',
};

const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
};

const Issues = ({ repositoryOwner, repositoryName, issueState, onChangeIssueState }) => (
  <div className="Issues">
    <ButtonUnobtrusive onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}>
      {TRANSITION_LABELS[issueState]}
    </ButtonUnobtrusive>

    {isShow(issueState) && (
      <Query
        query={GET_ISSUES_OF_REPOSITORY}
        variables={{
          repositoryOwner,
          repositoryName,
          issueState,
        }}
      >
        {({ data, loading, error, fetchMore }) => {
          if (error) {
            return <ErrorMessage error={error} />;
          }

          const { repository } = data;

          if (loading && !repository) {
            return <Loading />;
          }

          return <IssueList issues={repository.issues} loading={loading} fetchMore={fetchMore} />;
        }}
      </Query>
    )}
  </div>
);

const IssueList = ({ issues, loading, fetchMore }) => (
  <div className="IssueList">
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} />
    ))}
    <FetchMore
      loading={loading}
      hasNextPage={issues.pageInfo.hasNextPage}
      variables={{
        cursor: issues.pageInfo.endCursor,
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      issues
    </FetchMore>
  </div>
);

export default withState('issueState', 'onChangeIssueState', ISSUE_STATES.NONE)(Issues);
