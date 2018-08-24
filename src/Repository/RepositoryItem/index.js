import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Link from '../../Link';
import Button from '../../Button';
import '../style.css';

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const UNSTAR_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const SUBSCRIBE_TO_REPOSITORY = gql`
  mutation($id: ID!) {
    updateSubscription(input: { subscribableId: $id, state: SUBSCRIBED }) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const UNSUBSCRIBE_TO_REPOSITORY = gql`
  mutation($id: ID!) {
    updateSubscription(input: { subscribableId: $id, state: UNSUBSCRIBED }) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}) => (
  <div>
    <div className="RepositoryItem-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div>
        {!viewerHasStarred ? (
          <Mutation mutation={STAR_REPOSITORY} variables={{ id }}>
            {(addStar, { data, loading, error }) => (
              <Button className={'RepositoryItem-title-action'} onClick={addStar}>
                {stargazers.totalCount} Stars
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation mutation={UNSTAR_REPOSITORY} variables={{ id }}>
            {(removeStar, { data, loading, error }) => (
              <Button className={'RepositoryItem-title-action'} onClick={removeStar}>
                {stargazers.totalCount} Stars
              </Button>
            )}
          </Mutation>
        )}

        {viewerSubscription === 'UNSUBSCRIBED' ? (
          <Mutation mutation={SUBSCRIBE_TO_REPOSITORY} variables={{ id }}>
            {(updateSubscription, { data, loading, error }) => (
              <Button className={'RepositoryItem-title-action'} onClick={updateSubscription}>
                {watchers.totalCount} Watchers
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation mutation={UNSUBSCRIBE_TO_REPOSITORY} variables={{ id }}>
            {(updateSubscription, { data, loading, error }) => (
              <Button className={'RepositoryItem-title-action'} onClick={updateSubscription}>
                {watchers.totalCount} Watchers
              </Button>
            )}
          </Mutation>
        )}
      </div>
    </div>

    <div className="RepositoryItem-description">
      <div className="RepositoryItem-description-info" dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
      <div className="RepositoryItem-description-details">
        <div>{primaryLanguage && <span>Language: {primaryLanguage.name}</span>}</div>
        <div>
          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
