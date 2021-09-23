import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import Followers from "../components/Followers";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = (props) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);
    let res = await fetch(`https://api.github.com/users/${user}`);
    let data = await res.json();
    if (data.message) {
      toggleError(true, "User not found!");
    } else {
      setGithubUser(data);
      const { login, followers_url } = data;

      const allSet = await Promise.allSettled([
        fetch(`${rootUrl}/users/${login}/repos?per_page=100`),
        await fetch(`${followers_url}?per_page=100`),
      ]);
      const [repos, follower] = allSet;
      const status = "fulfilled";

      if (repos.status === status) {
        data = await repos.value.json();
        setRepos(data);
      }
      if (follower.status === status) {
        data = await follower.value.json();
        setFollowers(data);
      }
    }

    checkRequests();
    setIsLoading(false);
  };

  const checkRequests = async () => {
    const req = await fetch(`${rootUrl}/rate_limit`);
    const data = await req.json();
    let { remaining } = data.rate;
    setRequests(remaining);

    if (remaining === 0) {
      toggleError(true, "Sorry, you have passed your hourly limit!");
    }
  };

  const toggleError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  useEffect(() => {
    checkRequests();
  }, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
