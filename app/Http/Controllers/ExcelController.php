<?php

namespace App\Http\Controllers;
use Response;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use App\Models\Event;
use App\Models\Transaction ;
use App\Models\Vendor;
use App\Models\User;
use Mail;
use DB;

class ExcelController extends Controller
{
    public function report(){
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $colArray = ["A", "B", "C", "D", "E", "F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ","BA","BB","BC"];
        
        $joiining =DB::table('transactions as t')
                ->select(['b.booking_id as ticket_id', 'u.email', 'u.number', 'u.first_name as customer_first_name' , 'u.last_name as customer_last_name', 't.created_at', 't.payment_status', 't.total_amount', 't.total_discount', 't.tax', 't.payable_amount', 't.updated_at', 't.transaction_id', 't.coupon_amount'])
                ->join('bookings as b', 'b.u_id', '=', 't.u_id')
                ->join('users as u','b.user_id','=', 'u.id')
                ->join('events as e','b.event_id', '=' ,'e.id')
                ->join('vendors as v','b.vendor_id','=','v.id')
                ->get();
        
    
        for($i = 1; $i <= count($joiining); $i++){
            if($i == 1){
                $sheet->setCellValue('A1', 'Order ID');
                $sheet->setCellValue('B1', 'Order Number');
                $sheet->setCellValue('C1', 'Order Created At');
                $sheet->setCellValue('D1', 'Status');
                $sheet->setCellValue('E1', 'Currency');
                $sheet->setCellValue('F1', 'Total');
                $sheet->setCellValue('G1', 'Total Shipping');
                $sheet->setCellValue('H1', 'Total Discount');
                $sheet->setCellValue('I1', 'Shipping Tax');
                $sheet->setCellValue('J1', 'Total Tax');
                $sheet->setCellValue('K1', 'Total Items');
                $sheet->setCellValue('L1', 'Cart Tax');
                $sheet->setCellValue('M1', 'Discount Tax');
                $sheet->setCellValue('N1', 'Total Fees');
                $sheet->setCellValue('O1', 'Total Refunds');
                $sheet->setCellValue('P1', 'Net');
                $sheet->setCellValue('Q1', 'Billing Address First Name');
                $sheet->setCellValue('R1', 'Billing Address Last Name');
                $sheet->setCellValue('S1', 'Billing Address Company');
                $sheet->setCellValue('T1', 'Billing Address Address 1');
                $sheet->setCellValue('U1', 'Billing Address Address 2');
                $sheet->setCellValue('V1', 'Billing Address City');
                $sheet->setCellValue('W1', 'Billing Address State');
                $sheet->setCellValue('X1', 'Billing Address Postcode');
                $sheet->setCellValue('Y1', 'Billing Address Country');
                $sheet->setCellValue('Z1', 'Billing Address Email');
                $sheet->setCellValue('AA1', 'Billing Address Phone');
                $sheet->setCellValue('AB1', 'Shipping Address First Name');
                $sheet->setCellValue('AC1', 'Shipping Address Last Name');
                $sheet->setCellValue('AD1', 'Shipping Address Company');
                $sheet->setCellValue('AE1', 'Shipping Address Address 1');
                $sheet->setCellValue('AF1', 'Shipping Address Address 2');
                $sheet->setCellValue('AG1', 'Shipping Address City');
                $sheet->setCellValue('AH1', 'Shipping Address State');
                $sheet->setCellValue('AI1', 'Shipping Address Postcode');
                $sheet->setCellValue('AJ1', 'Shipping Address Country');
                $sheet->setCellValue('AK1', 'Order Updated At');
                $sheet->setCellValue('AL1', 'Order Completed At');
                $sheet->setCellValue('AM1', 'Order Paid At');
                $sheet->setCellValue('AN1', 'Payment Method');
                $sheet->setCellValue('AO1', 'Payment Method Title');
                $sheet->setCellValue('AP1', 'Shipping Method Title');
                $sheet->setCellValue('AQ1', 'Transaction ID');
                $sheet->setCellValue('AR1', 'Order Key');
                $sheet->setCellValue('AS1', 'Customer IP');
                $sheet->setCellValue('AT1', 'Customer User Agent');
                $sheet->setCellValue('AU1', 'Customer Note');
                $sheet->setCellValue('AV1', 'Customer ID');
                $sheet->setCellValue('AW1', 'Customer Role');
                $sheet->setCellValue('AX1', 'Created Via');
                $sheet->setCellValue('AY1', 'Referring Site');
                $sheet->setCellValue('AZ1', 'Line Items');
                $sheet->setCellValue('BA1', 'Coupon Codes');
                $sheet->setCellValue('BB1', 'Coupon Amounts');
                $sheet->setCellValue('BC1', 'Fees');
            }else{
                $sheet->setCellValue('A'.$i, $joiining[$i -2] -> ticket_id);
                $sheet->setCellValue('B'.$i, '');
                $sheet->setCellValue('C'.$i, $joiining[$i -2] -> created_at);
                $sheet->setCellValue('D'.$i, $joiining[$i -2] ->payment_status == 1?'Paid':'Unpaid');
                $sheet->setCellValue('E'.$i, '$');
                $sheet->setCellValue('F'.$i, $joiining[$i -2] ->total_amount);
                $sheet->setCellValue('G'.$i, '0.00');
                $sheet->setCellValue('H'.$i, $joiining[$i -2] ->total_discount);
                $sheet->setCellValue('I'.$i, '0.00');
                $sheet->setCellValue('J'.$i, $joiining[$i -2] ->tax);
                $sheet->setCellValue('K'.$i, '1');
                $sheet->setCellValue('L'.$i, '0.00');
                $sheet->setCellValue('M'.$i, '0.00');
                $sheet->setCellValue('N'.$i, '0.00');
                $sheet->setCellValue('O'.$i, '0.00');
                $sheet->setCellValue('P'.$i, $joiining[$i -2] ->payable_amount);
                $sheet->setCellValue('Q'.$i, $joiining[$i -2] -> customer_first_name);
                $sheet->setCellValue('R'.$i, $joiining[$i -2] -> customer_last_name);
                $sheet->setCellValue('S'.$i, '');
                $sheet->setCellValue('T'.$i, '');
                $sheet->setCellValue('U'.$i, '');
                $sheet->setCellValue('V'.$i, '');
                $sheet->setCellValue('W'.$i, '');
                $sheet->setCellValue('X'.$i, '');
                $sheet->setCellValue('Y'.$i, '');
                $sheet->setCellValue('Z'.$i, $joiining[$i-2] -> email);
                $sheet->setCellValue('AA'.$i, $joiining[$i-2] -> number);
                $sheet->setCellValue('AB'.$i, '');
                $sheet->setCellValue('AC'.$i, '');
                $sheet->setCellValue('AD'.$i, '');
                $sheet->setCellValue('AE'.$i, '');
                $sheet->setCellValue('AF'.$i, '');
                $sheet->setCellValue('AG'.$i, '');
                $sheet->setCellValue('AH'.$i, '');
                $sheet->setCellValue('AI'.$i, '');
                $sheet->setCellValue('AJ'.$i, '');
                $sheet->setCellValue('AK'.$i, $joiining[$i -2] -> updated_at);
                $sheet->setCellValue('AL'.$i, $joiining[$i -2] -> created_at);
                $sheet->setCellValue('AM'.$i, $joiining[$i -2] -> created_at);
                $sheet->setCellValue('AN'.$i, 'Online');
                $sheet->setCellValue('AO'.$i, '');
                $sheet->setCellValue('AP'.$i, '');
                $sheet->setCellValue('AQ'.$i, $joiining[$i -2] -> transaction_id);
                $sheet->setCellValue('AR'.$i, '');
                $sheet->setCellValue('AS'.$i, '');
                $sheet->setCellValue('AT'.$i, '');
                $sheet->setCellValue('AU'.$i, '');
                $sheet->setCellValue('AV'.$i, '');
                $sheet->setCellValue('AW'.$i, '');
                $sheet->setCellValue('AX'.$i, '');
                $sheet->setCellValue('AY'.$i, '');
                $sheet->setCellValue('AZ'.$i, '');
                $sheet->setCellValue('BA'.$i, '');
                $sheet->setCellValue('BB'.$i, $joiining[$i - 2] -> coupon_amount);
                $sheet->setCellValue('BC'.$i, '');
            }
        }




      

       
        $writer = new Xlsx($spreadsheet);
        $filename = time().'.xlsx';
        $writer->save($filename);

        $data["email"] = "steadys@gmail.com";
        $data["title"] = "From eventmania";
        $data["body"] = "Today's report";

        $files = [
            public_path($filename)
        ];


        Mail::send('mail.report', $data, function($message)use($data, $files) {
            $message->to($data["email"], $data["email"])
                    ->subject($data["title"]); 
            foreach ($files as $file){
                $message->attach($file);
            }
            
        });


        return Response::json(['message'=>'Mail has been send successfully.'],200);
    }
}
