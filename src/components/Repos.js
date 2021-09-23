import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  const languages = repos.reduce((prev, curr) => {
    const { language, stargazers_count } = curr;
    if (!language) return prev;
    if (!prev[language]) {
      prev[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      prev[language] = {
        ...prev[language],
        value: prev[language].value + 1,
        stars: prev[language].stars + stargazers_count,
      };
    }
    return prev;
  }, {});

  const mostUsed = Object.values(languages)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const mostPopular = Object.values(languages)
    .sort((a, b) => b.stars - a.stars)
    .map((item) => {
      return { ...item, value: item.stars };
    })
    .slice(0, 5);

  //star and forks
  let { stars, forks } = repos.reduce(
    (prev, curr) => {
      const { stargazers_count, name, forks } = curr;
      prev.stars[stargazers_count] = { label: name, value: stargazers_count };
      prev.forks[forks] = { label: name, value: forks };
      return prev;
    },
    { stars: {}, forks: {} }
  );

  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

  return (
    <div className="section">
      <Wrapper className="section-center">
        {/* <ExampleChart data={chartData} /> */}
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
        <div></div>
      </Wrapper>
    </div>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
