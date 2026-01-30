<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\BogPaymentService;

class TestBogAuth extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'bog:test-auth';

    /**
     * The console command description.
     */
    protected $description = 'Test BOG OAuth2 authentication';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing BOG OAuth2 authentication...');
        $this->newLine();

        $bogService = new BogPaymentService();

        // Use reflection to access private method for testing
        $reflection = new \ReflectionClass($bogService);
        $method = $reflection->getMethod('getAccessToken');
//        $method->setAccessible(true);


        try {
            $token = $method->invoke($bogService);

            if ($token) {
                $this->info('✓ Successfully obtained access token');
                $this->line('Token preview: ' . substr($token, 0, 50) . '...');
                $this->newLine();
                $this->info('Configuration is correct!');
                return Command::SUCCESS;
            } else {
                $this->error('✗ Failed to obtain access token');
                $this->newLine();
                $this->warn('Please check:');
                $this->line('1. BOG_CLIENT_ID in .env');
                $this->line('2. BOG_CLIENT_SECRET in .env');
                $this->line('3. BOG_AUTH_URL in .env');
                $this->line('4. Your BOG merchant account is active');
                return Command::FAILURE;
            }
        } catch (\Exception $e) {
            $this->error('✗ Exception occurred: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
