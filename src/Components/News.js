//import { toHaveDisplayValue } from "@testing-library/jest-dom/dist/matchers";
import React, {useEffect,useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News=(props)=> {
 
const [articles, setArticles] = useState([])
const [loading, setLoading] = useState(true)
const [page, setPage ] = useState(1)
const [totalResults, setTotalResults ] = useState(0)

/*document.title = `${capitalizeFirstLetter(
  props.category
)}-Newslane`;*/

  //constructor for state
  //setting states

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

 

  const updateNews= async()=> {
    
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=75ba2b9b187a494ba87a9837e2f10fcd&page=${page}&pageSize=${props.pageSize}`;

    setLoading(true)
    let data = await fetch(url);
    
    let parsedData = await data.json();
    console.log(parsedData);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    
  }

  //useEffect replacing componentDidMount

  useEffect(() => {
    updateNews();
    document.title = `${capitalizeFirstLetter(
      props.category
    )}-Newslane`;

  
  }, [])
  

 
  
 

  //This function is used to concatinate the articles after loading a infinite scroller


  const fetchMoreData =async() => {
    setPage(page+1)

    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=75ba2b9b187a494ba87a9837e2f10fcd&page=${page+1}&pageSize=${props.pageSize}`;

   

    let data = await fetch(url);
    let parsedData = await data.json();

    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)

   
  };



 
    return (
      <div className="container my-2">
        <h1 className="text-center" style={{marginTop: '90px'}}>
          NewsLane- Top {capitalizeFirstLetter(props.category)}{" "}
          Headlines
        </h1>

       {loading &&<Spinner/>}

        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!==totalResults}
          //loader={<h4>Loading...</h4>}
         
        >
          <div className="row my-3">
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title.slice(0, 45) : " "}
                    description={
                      element.description
                        ? element.description.slice(0, 88)
                        : " "
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </InfiniteScroll>


        

      
      </div>
    );
  
}


News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
