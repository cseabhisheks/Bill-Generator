
import logo from '../assets/shiva-logo.png';

/**
 * PrintHeader – Letterhead for Dilip Kumar
 * (P.O.P, Gypsum, Ceiling Contractor)
 */
const PrintHeader = ({ refNo = '', date = '', panNumber = '', mobileNumber = '' }) => {
  const pan = String(panNumber || '').trim();
  const mobile = String(mobileNumber || '').trim();
  const showPan = pan.length > 0;
  const showMobile = mobile.length > 0;

  return (
    <div className="print-header mx-auto box-border w-full max-w-[800px] bg-white px-3 py-2 font-[Arial,Helvetica,sans-serif] text-black">

      {/* Top row */}
      {(showPan || showMobile) && (
        <div className="mb-1.5 flex items-center justify-between px-1">
          {showPan && (
            <span className="text-sm font-semibold text-[#1a3a8a]">
              PAN No : {pan}
            </span>
          )}

          {showMobile && (
            <span className="text-sm font-semibold text-[#1a3a8a]">
              Mob : {mobile}
            </span>
          )}
        </div>
      )}

      {/* Logo + Name + Details */}
      <div className="mb-1 flex items-center gap-4">

        <img
          src={logo}
          alt="Lord Shiva"
          className="w-[90px] shrink-0 object-contain"
        />

        <div className="flex-1 text-center">

          <h1 className="m-0 p-0 text-[32px] font-bold leading-[1.1] tracking-[1px] text-[#c41e3a]">
            DILIP KUMAR
          </h1>

          <p className="my-1 text-[15px] font-semibold text-[#1a3a8a]">
            ( P.O.P, Gypsum, Ceiling, Contractor)
          </p>

          <p className="m-0 text-sm font-semibold text-[#1a3a8a]">
            Add.: Village Barola, Sector-49, Noida(U.P.)
          </p>

        </div>
      </div>

      {/* Red line */}
      <div className="my-2 h-[3px] border-0 bg-[#c41e3a]" />

      {/* Ref No. & Date */}
      <div className="flex items-center justify-between px-1">

        <span className="text-sm font-medium text-black">
          Ref. No. {refNo || '......................'}
        </span>

        <span className="text-sm font-medium text-black">
          Date: {date || ''}
        </span>

      </div>

    </div>
  );
};

export default PrintHeader;

