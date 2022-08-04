import ReactLoading from "react-loading";

const withLoading = Component => {
  return function EnhancedComponent({ isLoading, ...props }) {
    if (!isLoading) {
      return <Component {...props} />;
    }

    return (
      <div className="flex justify-center mt-20">
        <ReactLoading type="spinningBubbles" height={100} width={100}/>
      </div>
    );
  };
}

export default withLoading;
