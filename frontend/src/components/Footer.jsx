export const Footer = () => {
  return (
    <div className="footer">
      <div className="slider">
        <div className="slide active">
          <img src="https://via.placeholder.com/300" alt="Effect 1" />
          <div className="text">Effect 1</div>
        </div>
        <div className="slide active">
          <img src="https://via.placeholder.com/300" alt="Effect 2" />
          <div className="text">Effect 2</div>
        </div>
        <div className="slide active">
          <img src="https://via.placeholder.com/300" alt="Effect 3" />
          <div className="text">Effect 3</div>
        </div>
        {/* Add more slides as needed */}
      </div>
    </div>
  );
};
