type TContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className = "" }: TContainerProps) => {
  return (
    <div className={`container mx-auto px-5 sm:px-6 lg:px-0 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
