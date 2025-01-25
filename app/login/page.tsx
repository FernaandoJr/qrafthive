import SignupFormDemo from "../../components/signup-form-demo"
import {BackgroundBeams} from "../../components/ui/background-beams"

export default function Home() {

  return (
    <div className="register-form flex justify-center mt-4 mb-4 bg-dark">
        <form action="">
          <div className="title flex justify-center">
            <h1 className="text-4xl text-bold">Register</h1>
          </div>
          <SignupFormDemo />
        </form>
        <BackgroundBeams />
      </div>
  );
}
