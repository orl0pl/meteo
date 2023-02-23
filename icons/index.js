// Openweathermap icons import
import i01d from "./01d.png";
import i01n from "./01n.png";
import i02d from "./02d.png";
import i02n from "./02n.png";
import i03d from "./03d.png";
import i03n from "./03n.png";
import i04d from "./04d.png";
import i04n from "./04n.png";
import i05d from "./05d.png";
import i05n from "./05n.png";
import i06d from "./06d.png";
import i06n from "./06n.png";
import i07d from "./07d.png";
import i07n from "./07n.png";
import i08d from "./08d.png";
import i08n from "./08n.png";
import i09d from "./09d.png";
import i09n from "./09n.png";
import i10d from "./10d.png";
import i10n from "./10n.png";
import i11d from "./11d.png";
import i11n from "./11n.png";
import i12d from "./12d.png";
import i12n from "./12n.png";
import i13d from "./13d.png";
import i13n from "./13n.png";
import i14d from "./14d.png";
import i14n from "./14n.png";
import i15d from "./15d.png";
import i15n from "./15n.png";
import i16d from "./16d.png";
import i16n from "./16n.png";

function iconFromCode(code) {
    switch (code) {
        //cases for Openweathermap icons
        case "01d":
            return i01d;
        case "01n":
            return i01n;
        case "02d":
            return i02d;
        case "02n":
            return i02n;
        case "03d":
            return i03d;
        case "03n":
            return i03n;
        case "04d":
            return i04d;
        case "04n":
            return i04n;
        case "09d":
            return i08d;
        case "09n":
            return i08n;
        case "10d":
            return i07d;
        case "10n":
            return i07n;
        case "11d":
            return i10d;
        case "11n":
            return i10n;
        case "13d":
            return i14d;
        case "13n":
            return i14n;
        case "50d":
            return i13d;
        case "50n":
            return i13n;

    }
}
export default iconFromCode;