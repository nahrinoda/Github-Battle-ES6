import React from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api";
import Loading from "./Loading";

function SelectedLanguage({ selectedLanguage, onSelect }) {
  const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];
  return (
    <ul className="languages">
      {languages.map(lang => (
        <li
          style={lang === selectedLanguage ? { color: "red" } : null}
          onClick={() => onSelect(lang)}
          key={lang}
        >
          {lang}
        </li>
      ))}
    </ul>
  );
}

function RepoGrid({ repos }) {
  return (
    <ul className="popularList">
      {repos.map(({ name, stargazers_count, owner, html_url }, index) => (
        <li key={name} className="popularItem">
          <div className="popularRank">#{index + 1}</div>
          <ul className="spaceListItems">
            <li>
              <img
                className="avatar"
                src={owner.avatar_url}
                alt={"Avatar for " + owner.login}
              />
            </li>
            <li>
              {" "}
              <a href={html_url}>{name}</a>
            </li>
            <li>@{owner.login}</li>
            <li>{stargazers_count} stars</li>
          </ul>
        </li>
      ))}
    </ul>
  );
}

RepoGrid.proptypes = {
  repos: PropTypes.array.isRequired
};

SelectedLanguage.proptypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

class Popular extends React.Component {
  state = {
    selectedLanguage: "All",
    repos: null
  };

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage = async lang => {
    this.setState(() => ({
      selectedLanguage: lang,
      repos: null
    }));

    const repos = await fetchPopularRepos(lang);

    this.setState(() => ({ repos }));
  };

  render() {
    const { selectedLanguage, repos } = this.state;

    return (
      <div>
        <SelectedLanguage
          selectedLanguage={selectedLanguage}
          onSelect={this.updateLanguage}
        />
        {!repos ? <Loading /> : <RepoGrid repos={repos} />}
      </div>
    );
  }
}

export default Popular;
